import { z } from 'zod';

const createSaleSchema = z
  .object({
    customer: z.string().trim().min(1, 'Customer is required.'),

    products: z
      .array(
        z.object({
          product: z.string().trim().min(1, 'Product is required.'),

          quantity: z
            .number({
              error: 'Quantity must be a number.',
            })
            .int('Quantity must be an integer.')
            .min(1, 'Quantity must be at least 1.'),
        }),
      )
      .min(1, 'At least one product is required.'),
  })
  .superRefine((data, ctx) => {
    const ids = data.products.map((item) => item.product);

    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['products'],
        message: 'Duplicate products are not allowed.',
      });
    }
  });

export const saleValidation = {
  createSaleSchema,
};
