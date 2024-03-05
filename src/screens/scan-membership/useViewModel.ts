import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { FULFILLMENT_NAV } from '../../utils/navigation';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();
  const [textMembershipID, setTextMembershipID] = useState<string>('');

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

  const handleMembershipIDChange = (text: string) => {
    const formattedID = formatMembershipID(text);
    setTextMembershipID(formattedID);
  };

  const handleConfirmPress = () => {
    navigate(FULFILLMENT_NAV);
  };

  return { textMembershipID, handleMembershipIDChange, handleConfirmPress };
};

export default useViewModel;
