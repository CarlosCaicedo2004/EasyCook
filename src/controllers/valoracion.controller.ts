import { Request, Response } from "express";
import Valoracion from "../models/valoracion.model";

export const createValoracion = async (req: Request, res: Response) => {
  const val = await Valoracion.create(req.body);
  res.json(val);
};

export const getValoraciones = async (_: Request, res: Response) => {
  const vals = await Valoracion.find();
  res.json(vals);
};

export const deleteValoracion = async (req: Request, res: Response) => {
  await Valoracion.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
};