import { useCallback, useState } from 'react';
import { useFlow, FLOW_EVENT_CHECK_MEMBERSHIP } from '../../context/flow';

const useViewModel = () => {
  const [textMembershipID, setTextMembershipID] = useState<string>('');

  const { emitFlowEvent } = useFlow();

  const formatMembershipID = (text: string) => {
    // Remove any non-numeric characters from the input
    const formattedText = text.replace(/\D/g, '');

    // Insert a space after every 4 characters
    let formattedID = '';
    for (let i = 0; i < formattedText.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedID += ' ';
      }
      formattedID += formattedText[i];
    }

    return formattedID;
  };

  const onCheckMembershipId = useCallback(() => {
    const membershipIdWithoutSpaces = textMembershipID.replace(/\s/g, '');

    emitFlowEvent(FLOW_EVENT_CHECK_MEMBERSHIP, {
      id: membershipIdWithoutSpaces,
    });
  }, [emitFlowEvent, textMembershipID]);

  const handleMembershipIDChange = (text: string) => {
    const formattedID = formatMembershipID(text);
    setTextMembershipID(formattedID);
  };

  const handleConfirmPress = () => {
    onCheckMembershipId();
  };

  return { textMembershipID, handleMembershipIDChange, handleConfirmPress };
};

export default useViewModel;
