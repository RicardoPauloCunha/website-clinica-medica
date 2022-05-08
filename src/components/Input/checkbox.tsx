import { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { FormGroup, Input, Label, InputProps, FormFeedback } from 'reactstrap';

interface CheckboxInputProps extends InputProps {
    name: string;
    label: string;
    options: {
        label: string;
        value: string;
    }[];
}

const CheckboxInput = ({ name, label, options, ...rest }: CheckboxInputProps) => {
    const inputRefs = useRef([]);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRefs.current,
            getValue: (refs) => {
                return refs
                    .filter((ref: any) => ref != null && ref.checked)
                    .map((ref: any) => ref.value);
            },
            setValue: (refs, values: string[]) => {
                refs
                    .filter((ref: any) => values.includes(ref.id))
                    .forEach((ref: any) => {
                        ref.checked = true;
                    });
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
                        defaultChecked={defaultValue?.some((def: string) => def === opt.value)}
                        value={opt.value}
                        type="checkbox"
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

export default CheckboxInput;