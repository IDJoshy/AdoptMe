import { Router } from "express";

import { mockUsers, mockPets, generateData } from "../controllers/mocking.controller.js"; 

const router = Router();
router.get('/mockingpets',mockPets);
router.get('/mockingusers', mockUsers);
router.post('/generateData', generateData);

export default router;