import { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { hasValueString } from '../../util/stringFormat';

import { FormGroup, Input, Label, InputProps, FormFeedback } from 'reactstrap';

interface SelectInputProps extends InputProps {
    name: string;
    label: string;
    placeholder: string;
    options: {
        label: string;
        value: string;
    }[];
    handlerChange?: (optionValue: string) => void;
}

const SelectInput = ({ name, label, placeholder, options, handlerChange, ...rest }: SelectInputProps) => {
    const inputRef = useRef(null);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            getValue: (ref) => {
                return ref.value;
            },
            setValue: (ref, value) => {
                ref.value = value;
            },
            clearValue: (ref) => {
                ref.value = "";
            }
        });
    }, [fieldName, registerField]);

    const changeOption = (optionValue: string) => {
        if (handlerChange !== undefined)
            handlerChange(optionValue);
    }

    return (
        <FormGroup>
            <Label htmlFor={fieldName}>
                {label}
            </Label>

            <Input
                id={fieldName}
                innerRef={inputRef}
                defaultValue={hasValueString(defaultValue) ? defaultValue : ""}
                type="select"
                invalid={hasValueString(error)}
                onFocus={clearError}
                onChange={e => changeOption(e.target.value)}
                {...rest}
            >
                <option
                    value=""
                    disabled
                >
                    {placeholder}
                </option>

                {options.map(opt => (
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {opt.label}
                    </option>
                ))}
            </Input>

            {error && <FormFeedback>
                {error}
            </FormFeedback>}
        </FormGroup>
    );
}

export default SelectInput;