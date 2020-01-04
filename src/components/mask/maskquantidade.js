import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import PropTypes from 'prop-types';

const TextMaskQuantidade = props => {
  const { inputRef, className, label, onChange, value } = props;

  const numberMask = createNumberMask({
    prefix: "",
    guide: false,
    decimalLimit: false,
    includeThousandsSeparator: false
    //suffix: "" // This will put the dollar sign at the end, with a space.
  });

  return (
    <MaskedInput
      ref={inputRef}
      className={className}
      label={label}
      mask={numberMask}
      value={value}
      onChange={onChange}
    />
  );
};

TextMaskQuantidade.propTypes = {
  inputRef: PropTypes.func.isRequired
};

export default TextMaskQuantidade;