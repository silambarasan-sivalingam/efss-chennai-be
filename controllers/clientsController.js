import Client from "../models/Client.js";
import { StatusCodes } from "http-status-codes";
import {
    BadRequestError,
    NotFoundError,
    UnAuthenticated,
  } from '../errors/index.js'

import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

const createClient = async (req, res) => {

    const { clientName, 
            contactNo, 
            address,
            fasNo,
            } = req.body

    if(!clientName || !contactNo || !address || !fasNo  ) {
        throw new BadRequestError('Please provide all values')
    }
    req.body.createdBy = '62f756f59e173856202d58ca'
    const client = await Client.create(req.body)
    res.status(StatusCodes.CREATED).json({ client })

    }

const getAllClients = async (req, res) => {

    const { status, alertMonth, sort, search } = req.query

    const queryObject = {
        createdBy: '62f756f59e173856202d58ca'
    }

    if (status && status !== 'all') {
        queryObject.status = status
      }
      if (alertMonth && alertMonth !== 'all') {
        queryObject.alertMonth = alertMonth
      }
      if (search) {
        queryObject.clientName = { $regex: search, $options: 'i' }
      }

      // NO AWAIT

  let result = Client.find(queryObject)

  // chain sort conditions


  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('clientName')
  }
  if (sort === 'z-a') {
    result = result.sort('-clientName')
  }

  //

  // setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const clients = await result

  const totalClients = await Client.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalClients / limit)

  res.status(StatusCodes.OK).json({ clients, totalClients, numOfPages })
}
    
const updateClient = async(req, res) => {
    const { id: clientId} = req.params

    const { clientName, 
        contactNo, 
        address,
        fasNo,
        } = req.body

    if(!clientName || !contactNo || !address || !fasNo  ) {
        throw new BadRequestError('Please provide all values')
    }

    const client = await Client.findOne({_id: clientId })

    if(!client) {
        throw new NotFoundError(`No job with id :${clientId}`)
    }

    const updatedClient = await Client.findOneAndUpdate({ _id: clientId }, req.body, {
        new: true,
        runValidators: true,
      })
    
      res.status(StatusCodes.OK).json({ updatedClient })
}

const deleteClient = async (req, res) => {
    const { id: clientId } = req.params
  
    const client = await Client.findOne({ _id: clientId })
  
    if (!client) {
      throw new NotFoundError(`No job with id :${clientId}`)
    }
  
    await client.remove()
  
    res.status(StatusCodes.OK).json({ msg: 'Success! client removed' })
  }

const showStats = async (req, res) => {
    let stats = await Client.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId('62f756f59e173856202d58ca') } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    stats = stats.reduce((acc, curr) => {
      const { _id: title, count } = curr
      acc[title] = count
      return acc
    }, {})
  
    const defaultStats = {
      pending: stats.pending || 0,
      active: stats.active || 0,
      inactive: stats.inactive || 0,
    }
  
    let monthlyApplications = await Client.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId('62f756f59e173856202d58ca') } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ])
    monthlyApplications = monthlyApplications
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item
        const date = moment()
          .month(month - 1)
          .year(year)
          .format('MMM Y')
        return { date, count }
      })
      .reverse()
  
    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
  }
  

export { createClient, deleteClient, getAllClients, updateClient, showStats }