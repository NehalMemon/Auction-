import express,{Router} from 'express';
import authRouter from './authRouter.js';
import ownerRouter from './ownerRouter.js';
import playerRouter from './playerRouter.js';
import teamRouter from './teamRouter.js';

const router = Router();


router.use('/auth',authRouter);
router.use('/owner',ownerRouter);
router.use('/player',playerRouter);
router.use('/team',teamRouter);

export default router;