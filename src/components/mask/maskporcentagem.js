import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import PropTypes from 'prop-types';

const TextMaskPercent = (props) => {

  const {
    inputRef,
    className,
    label,
    value,
    onChange
  } = props;
  
  const numberMask = createNumberMask({
     prefix: "",
     suffix: "",
     includeThousandsSeparator: false,
     thousandsSeparatorSymbol: ",",
     allowDecimal: true,
     decimalSymbol: ".",
     decimalLimit: 2, // how many digits allowed after the decimal
     integerLimit: 5, // limit length of integer numbers
     allowNegative: false,
     allowLeadingZeroes: false
    //suffix: " %" // This will put the dollar sign at the end, with a space.
  });

  return (
    <MaskedInput
      ref={inputRef}
      className={className}
      label={label}
      value={value}
      mask={numberMask}
      onChange={onChange}
    />
  );
}

TextMaskPercent.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

export default TextMaskPercent;