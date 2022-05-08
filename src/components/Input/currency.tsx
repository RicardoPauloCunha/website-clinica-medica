import { useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core';

import { convertCurrency, normalizeCurrency } from '../../util/formatCurrency';

import { FormGroup, Input, Label, InputProps, FormFeedback } from 'reactstrap';

interface CurrencyInputProps extends InputProps {
    name: string;
    label: string;
}

const CurrencyInput = ({ name, label, ...rest }: CurrencyInputProps) => {
    const inputRef = useRef(null);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(name);
    const [value, setValue] = useState(defaultValue === undefined ? "R$ 0,00" : convertCurrency(`${defaultValue}`));

    useEffect(() => {
        registerField<number>({
            name: fieldName,
            ref: inputRef.current,
            getValue: (ref) => {
                return normalizeCurrency(ref.value);
            },
            setValue: (ref, value: number) => {
                setValue(convertCurrency(value.toString()));
            },
            clearValue: (ref) => {
                setValue("R$ 0,00");
            },
        });
    }, [fieldName, registerField]);

    return (
        <FormGroup>
            <Label htmlFor={fieldName}>
                {label}
            </Label>

            <Input
                id={fieldName}
                innerRef={inputRef}
                value={value}
                onChange={e => setValue(convertCurrency(e.target.value))}
                invalid={error ? true : false}
                onFocus={clearError}
                {...rest}
            />

            {error && <FormFeedback>
                {error}
            </FormFeedback>}
        </FormGroup>
    );
}

export default CurrencyInput;