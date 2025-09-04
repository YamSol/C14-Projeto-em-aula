import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = Router();
const patientController = new PatientController();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /patients/transmitter/{transmitterId}:
 *   get:
 *     summary: Get patient ID by transmitter ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transmitterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do dispositivo transmissor
 *     responses:
 *       200:
 *         description: Patient ID found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Paciente encontrado"
 *                 data:
 *                   type: object
 *                   properties:
 *                     patientId:
 *                       type: string
 *                       example: "clp2xxx..."
 *       404:
 *         description: Patient not found for transmitter ID
 *       400:
 *         description: Transmitter ID is required
 *       401:
 *         description: Unauthorized
 */
router.get('/transmitter/:transmitterId', patientController.getUserByTransmitterId);

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 *       401:
 *         description: Unauthorized
 */
router.get('/', patientController.getAllPatients);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               condition:
 *                 type: string
 *               transmitterId:
 *                 type: string
 *                 description: ID do dispositivo transmissor
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', upload.single('photo'), patientController.createPatient);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient data
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', patientController.getPatientById);

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               condition:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', patientController.updatePatient);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', patientController.deletePatient);

/**
 * @swagger
 * /patients/{id}/history:
 *   get:
 *     summary: Get patient vital signs history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient vital signs history
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/history', patientController.getPatientHistory);

/**
 * @swagger
 * /patients/{id}/stats:
 *   get:
 *     summary: Get patient statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient statistics
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/stats', patientController.getPatientStats);

/**
 * @swagger
 * /patients/{id}/vital-signs:
 *   post:
 *     summary: Add vital signs for patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transmitterId:
 *                 type: string
 *               heartRate:
 *                 type: integer
 *               oxygenSaturation:
 *                 type: integer
 *               temperature:
 *                 type: number
 *     responses:
 *       200:
 *         description: Vital signs added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/vital-signs', patientController.addVitalSigns);

export default router;
