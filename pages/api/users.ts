import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users || []); // Always return an array
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  } else if (req.method === 'POST') {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const newUser = await prisma.user.create({
        data: { username, password: hashedPassword, role }, // Save the hashed password
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error("User creation error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      await prisma.user.delete({ where: { id: Number(id) } });
      res.status(204).end();
    } catch (error) {
      console.error("User deletion error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}