import { Request, Response } from "express";
import mongoose from "mongoose";
import Usuario from "../models/usuario.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // verificar si ya existe
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      role: "user" // 🔥 default seguro
    });

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y password requeridos" });
    }

    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.password) {
      return res.status(404).json({ message: "La contraseña es obligatoria" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "SECRETO_SUPER",
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || "REFRESH_SECRET",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      refreshToken,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error en login", error });
  }
};


export const getUsuarios = async (_: Request, res: Response) => {
  try {
    const users = await Usuario.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};


export const getUsuario = async (req: Request, res: Response) => {
  try {
    const user = await Usuario.findById(req.params.id)
      .select("-password")
      .populate("recetas_favoritas");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    // evitar cambiar role o password aquí
    delete updates.password;
    delete updates.role;

    const user = await Usuario.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};


export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userToken = (req as any).user; // viene del JWT
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const user = await Usuario.findById(userToken.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // validar contraseña actual
    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    // evitar misma contraseña
    const isSame = await bcrypt.compare(newPassword, user.password!);

    if (isSame) {
      return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la anterior" });
    }

    // hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // invalidar refresh token
    // user.refreshToken = null;

    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al cambiar contraseña", error });
  }
};

export const getHistorialReciente = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const historial = await Usuario.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },

      { $unwind: "$historial_recetas" },

      { $sort: { "historial_recetas.fecha_vista": -1 } },

      { $limit: 5 },

      {
        $lookup: {
          from: "recetas",
          localField: "historial_recetas.receta_id",
          foreignField: "_id",
          as: "receta"
        }
      },

      { $unwind: "$receta" },

      {
        $project: {
          _id: 0,
          receta: 1,
          fecha_vista: "$historial_recetas.fecha_vista"
        }
      }
    ]);

    res.json(historial);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial", error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    );

    const user = await Usuario.findById(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh token inválido" });
    }

    // nuevo access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { userId } = req.body;

  await Usuario.findByIdAndUpdate(userId, {
    refreshToken: null
  });

  res.json({ message: "Logout exitoso" });
};