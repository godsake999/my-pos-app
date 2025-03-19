// pages/api/sales.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { cart, total } = req.body;

      // Start a transaction to update inventory and create the sale
      const transaction = await prisma.$transaction(async (prisma) => {
        // Deduct quantities from inventory
        for (const item of cart) {
          const product = await prisma.product.findUnique({
            where: { id: item.id },
          });

          if (!product || product.quantity < item.quantityInCart) {
            throw new Error(`Not enough stock for product: ${item.name}`);
          }

          await prisma.product.update({
            where: { id: item.id },
            data: {
              quantity: product.quantity - item.quantityInCart,
            },
          });
        }

        // Create the sale record
        const newSale = await prisma.sale.create({
          data: {
            total: parseFloat(total),
            items: JSON.stringify(cart),
          },
        });

        return newSale;
      });

      res.status(201).json(transaction);
    } else if (req.method === 'GET') {
      const sales = await prisma.sale.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(sales);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) {
    console.error('Database error:', error.message);
    res.status(500).json({ message: 'Failed to process sale', error: error.message });
  }
}