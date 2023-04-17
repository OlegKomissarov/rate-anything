import { create as createZustandStore } from 'zustand';

export default createZustandStore<{
    subject: string
    rate: number | string
    changeSubject: (subject: string) => void
    changeRate: (subject: number | string) => void
    resetForm: () => void
}>(set => ({
    subject: '',
    rate: '',
    changeSubject: (subject: string) => set({ subject, rate: '' }),
    changeRate: (rate: number | string) => set(() => {
        if (
            (typeof rate === 'string' && (rate === '' || rate === '-'))
            || (rate <= 10 && rate >= -10)
        ) {
            return { rate };
        }
        if ((typeof rate === 'number' || /^([-]?[1-9]\d*|0)$/.test(rate)) && +rate >= -10 && +rate <= 10) {
            return { rate: +rate };
        }
        return {};
    }),
    resetForm: () => set({ subject: '', rate: '' })
}));
