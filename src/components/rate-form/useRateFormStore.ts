import { create as createZustandStore } from 'zustand';
import { RefObject } from 'react';
import { validateRateValue } from '../../utils/validations';

export default createZustandStore<{
    subject: string
    rate: number | string
    changeSubject: (subject: string) => void
    changeRate: (subject: number | string) => void
    resetForm: () => void
    rateInputRef: RefObject<HTMLInputElement>
    setRateInputRef: (rateInputRef: RefObject<HTMLInputElement>) => void
}>(set => ({
    subject: '',
    rate: '',
    changeSubject: (subject: string) => set({ subject, rate: '' }),
    changeRate: (rate: number | string) => set(() => {
        if (typeof rate === 'string' && (rate === '' || rate === '-')) {
            return { rate };
        }
        if (typeof rate === 'string' && /^([-]?[1-9]\d*|0)$/.test(rate) && validateRateValue(+rate)) {
            return { rate: +rate };
        }
        if (validateRateValue(rate)) {
            return { rate: rate };
        }
        return {};
    }),
    resetForm: () => set({ subject: '', rate: '' }),
    rateInputRef: { current: null },
    setRateInputRef: (rateInputRef: RefObject<HTMLInputElement>) => set({ rateInputRef })
}));
