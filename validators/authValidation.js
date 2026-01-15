import {z} from 'zod';

export const registerSchema = z.object({
    name:z.string().min(3,'Name must be at least 3 characters long'),
    email:z.string().email('Please enter a valid email address'),
    password:z.string().min(6,'Password must be at least 6 characters long')
})

export const loginSchema = z.object({
    email:z.string().email('Please enter a valid email address'),
    password:z.string().min(6,'Password must be at least 6 characters long')
})

export const playerRegisterSchema = z.object({
    name:z.string().min(3,'Name must be at least 3 characters long'),
    email:z.string().email('Please enter a valid email address'),
    phoneNumber:z.string().regex(/^0[1-9]\d{1,10}$/, 'Please enter a valid phone number').optional(),
})

