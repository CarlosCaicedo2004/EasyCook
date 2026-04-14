import { Request, Response } from "express";
import Receta from "../models/receta.model";

export const createReceta = async (req: Request, res: Response) => {
  const receta = await Receta.create(req.body);
  res.json(receta);
};

export const getRecetas = async (_: Request, res: Response) => {
  const recetas = await Receta.find();
  res.json(recetas);
};

export const getReceta = async (req: Request, res: Response) => {
  const receta = await Receta.findById(req.params.id);
  res.json(receta);
};

export const updateReceta = async (req: Request, res: Response) => {
  const receta = await Receta.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(receta);
};

export const deleteReceta = async (req: Request, res: Response) => {
  await Receta.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
};

export const buscarPorIngrediente = async (req: Request, res: Response) => {
  const recetas = await Receta.find({ ingredientes: req.params.ing });
  res.json(recetas);
};

export const buscarPorTiempo = async (req: Request, res: Response) => {
  const recetas = await Receta.find({ tiempo_preparacion: { $lte: Number(req.params.time) } });
  res.json(recetas);
};

export const buscarPorTipo = async (req: Request, res: Response) => {
  const recetas = await Receta.find({ tipo: req.params.tipo });
  res.json(recetas);
};