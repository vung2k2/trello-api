// import ApiError from "../utils/ApiError";

import slugify from "slugify";
import { boadrModel } from "../models/boardModel";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };
    const createdBoard = await boadrModel.createNew(newBoard);
    const getNewBoard = await boadrModel.findOneById(createdBoard.insertedId);
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boadrModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }
    const resBoard = cloneDeep(board);
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => card.columnId.toString() == column._id.toString()
      );
    });
    delete resBoard.cards;
    return resBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = { createNew, getDetails };
