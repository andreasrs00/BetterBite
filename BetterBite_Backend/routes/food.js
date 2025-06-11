const Joi = require("joi");
const food = require("../controllers/foodController");

module.exports = [
  {
    method: "GET",
    path: "/foods",
    handler: async (request, h) => {
      try {
        const foods = await food.getAllFoods();
        return h
          .response({
            status: "success",
            data: foods,
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            status: "error",
            message: "Failed to retrieve foods",
          })
          .code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/foodphoto/{param*}',
    options: {
      auth: false,
    },
    handler: {
      directory: {
        path: '.',
        listing: false,
        index: false,
      }
    }
  },
  {
    method: "GET",
    path: "/foods/categories",
    handler: async (request, h) => {
      try {
        const categories = await food.getCategories();
        return h
          .response({
            status: "success",
            data: categories,
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            status: "error",
            message: "Failed to retrieve categories",
          })
          .code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/foods/category/{category}",
    options: {
      auth: false,
      validate: {
        params: Joi.object({
          category: Joi.string()
            .valid("Diet", "Bulking", "Maintenance")
            .required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const foods = await food.getFoodsByCategory(request.params.category);
        return h
          .response({
            status: "success",
            data: foods,
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            status: "error",
            message: "Failed to retrieve foods by category",
          })
          .code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/foods/search",
    options: {
      auth: 'default',
      validate: {
        query: Joi.object({
          q: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const results = await food.searchFoods(request.query.q);
        return h
          .response({
            status: "success",
            data: results,
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            status: "error",
            message: "Search failed",
          })
          .code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/foods/{food}",
    handler: async (request, h) => {
      try {
        const foods = await food.getAllFoods();
        const urlFood = decodeURIComponent(request.params.food).toLowerCase();

        const matchedFood = foods.find(
          (item) =>
            item.food.toLowerCase() === urlFood ||
            item.food.toLowerCase().replace(/\s+/g, "_") === urlFood
        );

        if (!matchedFood) {
          return h
            .response({
              status: "fail",
              message: "Food not found",
            })
            .code(404);
        }

        return h
          .response({
            status: "success",
            data: matchedFood,
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            status: "error",
            message: "Failed to retrieve food",
          })
          .code(500);
      }
    },
  },
];
