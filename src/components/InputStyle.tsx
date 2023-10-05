import {Platform} from 'react-native';

export const InputStyle = (touched?: any, errors?: any) =>
    `
    ${Platform.OS === 'ios' ? 'py-4' : 'py-3 '}
    px-4
    rounded-xl
    text-lg 
    leading-6
    font-PoppinsRegular 
    bg-white 
    border 
    placeholder:text-slate-400 
    ${
        touched && errors
            ? 'text-red-600 border-red-600'
            : 'text-solar-blue-dark border-gray-300'
    }`;

export const LabelStyle = `
    pl-2
    text-sm 
    font-PoppinsBold 
    text-gray-500
    `;

export const ListStyle = `
    px-2
    rounded-xl
    text-lg 
    leading-6
    font-PoppinsRegular 
    bg-white 
    border 
    border-gray-300
    shadow-sm
    ${Platform.OS === 'ios' ? 'shadow-gray-200' : 'shadow-gray-400'}
    `;
