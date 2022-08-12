import express from 'express'

const router = express.Router()

import { createClient, deleteClient, getAllClients, updateClient, showStats } from '../controllers/clientsController.js'


router.route('/').post(createClient).get(getAllClients)

router.route('/stats').get(showStats)

router.route('/:id').delete(deleteClient).patch(updateClient)

export default router