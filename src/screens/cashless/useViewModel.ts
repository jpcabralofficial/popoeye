const useViewModel = () => {
  const handleCardPress = (payment: 'gcash' | 'maya') => {
    if (payment === 'gcash') {
      console.log(payment);
    } else {
      console.log(payment);
    }
  };

  return {
    handleCardPress,
  };
};

export default useViewModel;
