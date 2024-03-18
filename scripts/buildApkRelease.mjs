import {
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  appendFileSync,
  rmSync,
} from 'fs';
import { spawnSync } from 'child_process';
import { platform } from 'process';

const BRIDGE_DIR = 'node_modules/serino-pos-kotlin-bridge';
const BRIDGE_ANDROID_DIR = `${BRIDGE_DIR}/android`;
const BRIDGE_LIBS_DIR = `${BRIDGE_ANDROID_DIR}/libs`;
const BRIDGE_BUILD_PATH = `${BRIDGE_ANDROID_DIR}/build.gradle`;
const RN_SETTINGS_PATH = 'android/settings.gradle';
const BUNDLE_DIR = 'android/app/src/main/assets';

const SPAWN_OPTIONS = {
  encoding: 'utf-8',
  stdio: 'inherit',
  shell: true,
};

const getLibName = filename => {
  const nameSplit = filename.split('-');
  for (let i = 0; i < nameSplit.length; i++) {
    const s = nameSplit[i];
    if (
      s.match('debug') ||
      s.match('release') ||
      s.match(/[0-9]*\.[0-9]*\.[0-9]*/)
    ) {
      return nameSplit.slice(0, i).join('-');
    }
  }

  return filename.slice(0, filename.indexOf('.aar'));
};

const bridgeBuildBuf = readFileSync(BRIDGE_BUILD_PATH, 'utf-8');
const rnSettingsBuf = readFileSync(RN_SETTINGS_PATH, 'utf-8');
const libs = readdirSync(BRIDGE_LIBS_DIR);
const libDirs = [];

console.log('Saving git state...');

const gitDescribe = spawnSync('git describe --always --tags --long --dirty', {
  ...SPAWN_OPTIONS,
  stdio: ['ignore', 'pipe', 'inherit'],
});

const gitStatus = spawnSync('git status --porcelain', {
  ...SPAWN_OPTIONS,
  stdio: ['ignore', 'pipe', 'inherit'],
});

const buildBranchName = `build/${gitDescribe.stdout}`;

let isIndexChanged = false;
let isWorkTreeChanged = false;

gitStatus.stdout.split('\n').forEach(line => {
  if (!line) {
    return;
  }

  const X = line[0];
  const Y = line[1];

  if (!isIndexChanged && X !== ' ') {
    isIndexChanged = true;
  }

  if (!isWorkTreeChanged && Y !== ' ') {
    isWorkTreeChanged = true;
  }
});

if (isIndexChanged) {
  spawnSync(
    'git',
    ['checkout', '--quiet', '-b', buildBranchName],
    SPAWN_OPTIONS,
  );
  spawnSync(
    'git',
    ['commit', '--no-verify', '-m', '"commit index changes"'],
    SPAWN_OPTIONS,
  );
}

if (isWorkTreeChanged) {
  spawnSync('git', ['stash', '--quiet', '--include-untracked'], SPAWN_OPTIONS);
  spawnSync('git', ['stash', 'apply', '--quiet'], SPAWN_OPTIONS);
}

console.log();

let buildSuccess = true;

try {
  console.log('Starting preprocess...');

  console.log('Running postversion:rebuild');
  spawnSync('npm', ['run', 'postversion:rebuild'], SPAWN_OPTIONS);

  console.log();

  libs.forEach(lib => {
    if (lib.endsWith('.aar')) {
      const libName = getLibName(lib);
      const libDir = `${BRIDGE_ANDROID_DIR}/${libName}`;
      const libPath = `${BRIDGE_LIBS_DIR}/${lib}`;
      const buildData = `configurations.maybeCreate("default")\nartifacts.add("default", file('${lib}'))\n`;
      const settingsAppend = `\ninclude ':${libName}'\nproject (':${libName}').projectDir = new File('../${libDir}')\n`;

      console.log(`Processing '${libName}' lib...`);
      libDirs.push(libDir);

      if (!existsSync(libDir)) {
        console.log(`Creating dir '${libDir}'`);
        mkdirSync(libDir);
      }

      console.log(`Copying '${lib}' to '${libDir}'`);
      copyFileSync(libPath, `${libDir}/${lib}`);

      console.log(`Creating ${libDir}/build.gradle`);
      writeFileSync(`${libDir}/build.gradle`, buildData, 'utf8');

      console.log(`Updating '${RN_SETTINGS_PATH}'`);
      appendFileSync(RN_SETTINGS_PATH, settingsAppend, 'utf8');
    }
  });

  let bridgeBuildNewData = '';
  bridgeBuildBuf.split('\n').forEach(line => {
    if (line.includes('libs/') && line.includes('.aar')) {
      let newLine = line;
      newLine = newLine.replace('.aar', '');
      newLine = newLine.replace('-debug', '');
      newLine = newLine.replace('-release', '');
      newLine = newLine.replace(`-\${module_version}`, '');
      newLine = newLine.replace('libs/', ':');
      newLine = newLine.replace('files(', 'project(');
      newLine = newLine.replace('implementation', 'api');
      bridgeBuildNewData += newLine + '\n';
    } else {
      bridgeBuildNewData += line + '\n';
    }
  });

  console.log(`Updating '${BRIDGE_BUILD_PATH}'`);
  writeFileSync(BRIDGE_BUILD_PATH, bridgeBuildNewData);

  if (!existsSync(BUNDLE_DIR)) {
    console.log(`Creating dir '${BUNDLE_DIR}'`);
    mkdirSync(BUNDLE_DIR);
  }

  console.log();
  console.log('Starting build...');

  console.log('Bundling...');
  const bundler = spawnSync(
    'npx',
    [
      'react-native',
      'bundle',
      '--platform',
      'android',
      '--dev',
      'false',
      '--entry-file index.js',
      '--bundle-output',
      'android/app/src/main/assets/index.android.bundle',
      '--assets-dest',
      'android/app/src/main/res',
    ],
    SPAWN_OPTIONS,
  );
  console.log(`Bundler status: ${bundler.status}`);

  console.log();
  console.log('Deleting generated directories that causes conflicts');

  const readDirOptions = { withFileTypes: true };
  const resDirs = readdirSync('android/app/src/main/res', readDirOptions)
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  resDirs.forEach(resDir => {
    if (resDir.startsWith('drawable-')) {
      const dirPath = `android/app/src/main/res/${resDir}`;
      console.log(`Deleting dir ${dirPath}`);
      rmSync(dirPath, { recursive: true });
    }
  });

  console.log();
  console.log('Assembling...');
  const gradleCmd = platform === 'win32' ? '.\\gradlew' : './gradlew';
  const assembler = spawnSync(gradleCmd, ['assembleRelease'], {
    ...SPAWN_OPTIONS,
    cwd: './android',
  });
  console.log(`Assembler status: ${assembler.status}`);

  buildSuccess = bundler.status === 0 && assembler.status === 0;
} finally {
  console.log();
  console.log('Starting clean up...');

  console.log('Restoring git state...');
  spawnSync('git', ['reset', '--hard'], SPAWN_OPTIONS);
  spawnSync('git', ['clean', '-d', '--force'], SPAWN_OPTIONS);

  if (isIndexChanged) {
    spawnSync('git', ['checkout', '--quiet', '-'], SPAWN_OPTIONS);
    spawnSync(
      'git',
      ['cherry-pick', '--no-commit', buildBranchName],
      SPAWN_OPTIONS,
    );
    spawnSync('git', ['branch', '-D', buildBranchName], SPAWN_OPTIONS);
  }

  if (isWorkTreeChanged) {
    spawnSync('git', ['stash', 'pop', '--quiet'], SPAWN_OPTIONS);
  }

  console.log();

  libDirs.forEach(dir => {
    console.log(`Deleting dir '${dir}'`);
    rmSync(dir, { recursive: true });
  });

  console.log(`Reverting '${RN_SETTINGS_PATH}'`);
  writeFileSync(RN_SETTINGS_PATH, rnSettingsBuf);

  console.log(`Reverting '${BRIDGE_BUILD_PATH}'`);
  writeFileSync(BRIDGE_BUILD_PATH, bridgeBuildBuf);
}

console.log();

if (!buildSuccess) {
  console.log('Build failed!');
  throw new Error('Build failed!');
}

console.log('Build done!');
console.log(
  'Release APK: android/app/build/outputs/apk/release/app-release.apk',
);
