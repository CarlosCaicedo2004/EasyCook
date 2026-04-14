import { Request, Response } from "express";
import Usuario from "../models/usuario.model";

export const createUsuario = async (req: Request, res: Response) => {
  const user = await Usuario.create(req.body);
  res.json(user);
};

export const getUsuarios = async (_: Request, res: Response) => {
  const users = await Usuario.find();
  res.json(users);
};

export const getUsuario = async (req: Request, res: Response) => {
  const user = await Usuario.findById(req.params.id);
  res.json(user);
};

export const updateUsuario = async (req: Request, res: Response) => {
  const user = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
};

export const deleteUsuario = async (req: Request, res: Response) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
};

export const login = async (req: Request, res: Response) => {
  const user = await Usuario.findOne(req.body);
  res.json(user);
};