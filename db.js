db.users.aggregate([
    {
      $match: {
        joinedDate: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
      }
    },
    {
      $sort: { age: 1 }  // Sort by age in ascending order to get the youngest users
    },
    {
      $limit: 5  // Limit the result to the top 5 youngest users
    }
  ])

  db.users.createIndex({ joinedDate: 1, age: 1 })