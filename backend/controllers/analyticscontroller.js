const Student = require('../models/Student');
const Fee = require('../models/Fee');

const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [totalStudents, dueAgg, earnedAgg, classAgg, lifetimeAgg, duesByStudent] = await Promise.all([
      Student.countDocuments(),
      Fee.aggregate([
        { $match: { status: 'Unpaid' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Fee.aggregate([
        { $match: { status: 'Paid', month: currentMonth } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Student.aggregate([
        { $group: { _id: '$class', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // lifetime income — every fee ever marked Paid, regardless of month
      Fee.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      // per-student remaining dues, with each unpaid month listed, ascending by total due
      Fee.aggregate([
        { $match: { status: 'Unpaid' } },
        {
          $group: {
            _id: '$grno',
            totalDue: { $sum: '$amount' },
            months: { $push: { month: '$month', amount: '$amount' } }
          }
        },
        {
          $lookup: {
            from: 'students',
            localField: '_id',
            foreignField: 'grno',
            as: 'student'
          }
        },
        { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            grno: '$_id',
            name: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ['$student.first_name', ''] },
                    ' ',
                    { $ifNull: ['$student.last_name', ''] }
                  ]
                }
              }
            },
            class: '$student.class',
            totalDue: 1,
            monthsDue: '$months'
          }
        },
        { $sort: { totalDue: 1 } }
      ])
    ]);

    res.status(200).json({
      totalStudents,
      totalDue: dueAgg[0]?.total || 0,
      unpaidCount: dueAgg[0]?.count || 0,
      feeEarnedThisMonth: earnedAgg[0]?.total || 0,
      paidCountThisMonth: earnedAgg[0]?.count || 0,
      totalIncomeAllTime: lifetimeAgg[0]?.total || 0,
      paidCountAllTime: lifetimeAgg[0]?.count || 0,
      currentMonth,
      classDistribution: classAgg.map(c => ({ class: c._id, count: c.count })),
      duesByStudent
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAnalytics };