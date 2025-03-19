// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { category } = req.query; // Get category filter

      let products;
      if (category) {
        products = await prisma.product.findMany({ where: { category: category.toString() } });
      } else {
        products = await prisma.product.findMany();
      }

      console.log('Fetched products:', products); // Debugging
      res.status(200).json(products);
    } else if (req.method === 'POST') {
      const { name, price, quantity, category } = req.body;

      if (!name || !price || !quantity || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newProduct = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          category,
        },
      });

      res.status(201).json(newProduct);
    } else if (req.method === 'PUT') {
      const { id, name, price, quantity, category } = req.body;

      if (!id || !name || !price || !quantity || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: { name, price: parseFloat(price), quantity: parseInt(quantity), category },
      });

      res.status(200).json(updatedProduct);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
      }

      await prisma.product.delete({
        where: { id: Number(id) },
      });

      res.status(204).end();
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) {
    console.error('Database error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
