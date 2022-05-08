import { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { FormGroup, Input, Label, InputProps, FormFeedback } from 'reactstrap';

interface RadioInputProps extends InputProps {
    name: string;
    label: string;
    options: {
        label: string;
        value: string;
    }[];
}

const RadioInput = ({ name, label, options, ...rest }: RadioInputProps) => {
    const inputRefs = useRef([]);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRefs.current,
            getValue: (refs) => {
                const checked = refs.find((ref: any) => ref.checked);
                return checked ? checked.value : "";
            },
            setValue: (refs, value) => {
                const item = refs.find((ref: any) => ref.value === value);
                if (item)
                    item.checked = true;
            },
            clearValue: (refs) => {
                refs.forEach((ref: any) => {
                    ref.checked = false;
                });
            },
        });
    }, [fieldName, registerField]);

    return (
        <FormGroup tag="fieldset">
            <Label>
                {label}
            </Label>

            {options.map((opt, index) => (
                <FormGroup
                    key={opt.label}
                    check
                >
                    <Input
                        id={opt.value}
                        name={fieldName}
                        innerRef={ref => (inputRefs.current[index] = ref as never)}
                        defaultChecked={defaultValue === opt.value}
                        value={opt.value}
                        type="radio"
                        invalid={error ? true : false}
                        onFocus={clearError}
                        {...rest}
                    />

                    {' '}

                    <Label
                        check
                        htmlFor={opt.value}
                    >
                        {opt.label}
                    </Label>
                </FormGroup>
            ))}

            {error && <FormFeedback>
                {error}
            </FormFeedback>}
        </FormGroup>
    );
}

export default RadioInput;