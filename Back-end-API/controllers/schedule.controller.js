
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        formation: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id: parseInt(id) },
      include: {
        formation: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!schedule) {
      return res.status(404).json({
        status: 'fail',
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: schedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const {
      dayOfWeek,
      startTime,
      endTime,
      location,
      formationId
    } = req.body;

    // Check if formation exists
    const formation = await prisma.formation.findUnique({
      where: { id: formationId }
    });

    if (!formation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Formation not found'
      });
    }

    // Create schedule
    const schedule = await prisma.schedule.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        location,
        formationId
      }
    });

    res.status(201).json({
      status: 'success',
      data: schedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dayOfWeek,
      startTime,
      endTime,
      location
    } = req.body;

    // Check if schedule exists
    const schedule = await prisma.schedule.findUnique({
      where: { id: parseInt(id) }
    });

    if (!schedule) {
      return res.status(404).json({
        status: 'fail',
        message: 'Schedule not found'
      });
    }

    // Update schedule
    const updatedSchedule = await prisma.schedule.update({
      where: { id: parseInt(id) },
      data: {
        dayOfWeek,
        startTime,
        endTime,
        location
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedSchedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if schedule exists
    const schedule = await prisma.schedule.findUnique({
      where: { id: parseInt(id) }
    });

    if (!schedule) {
      return res.status(404).json({
        status: 'fail',
        message: 'Schedule not found'
      });
    }

    // Delete schedule
    await prisma.schedule.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
