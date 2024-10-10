import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import React, { useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

// Action Types
const FETCH_PLANTS = 'FETCH_PLANTS';
const ADD_PLANT = 'ADD_PLANT';
const CREATE_TASKS = 'CREATE_TASKS';

const FETCH_PLANTS_REQUESTED = 'FETCH_PLANTS_REQUESTED'
const FETCH_PLANTS_SUCCEEDED = 'FETCH_PLANTS_SUCCEEDED'
const FETCH_PLANTS_FAILED = 'FETCH_PLANTS_FAILED'

const initialState = {
    loading: false,
    plants: [],
    error: ''
  }

const fetchPlantsRequest = () => {
  return {
    type: FETCH_PLANTS_REQUESTED
  }
}

const fetchPlantsSuccess = users => {
  return {
    type: FETCH_PLANTS_SUCCEEDED,
    payload: users
  }
}

const fetchPlantsFailure = error => {
  return {
    type: FETCH_PLANTS_FAILED,
    payload: error
  }
}

const plantReducer = (state = initialState, action) => {
    console.log(action.type)
    switch (action.type) {
      case FETCH_PLANTS_REQUESTED:
        return {
          ...state,
          loading: true
        }
      case FETCH_PLANTS_SUCCEEDED:
        return {
          loading: false,
          plants: action.payload,
          error: ''
        }
      case FETCH_PLANTS_FAILED:
        return {
          loading: false,
          plants: [],
          error: action.payload
        }
    }
  }


// Thunks (Async Actions)
export const fetchUsersPlants = () => {
    return function (dispatch) {
      dispatch(fetchPlantsRequest())
        
        axios
        .get(('/plants/get'))
        .then(response => {
            const plantData = response.data.map((plant) => ({
                id: plant.plant_id,
                name: plant.plant_name,
                wateringFrequency: plant.watering_frequency,
                lastWatered: moment(plant.latest_watered).local().format('YYYY-MM-DD'),
                imageURL: plant.image_url,
                imageFile: plant.image_blob,
            }));
            // response.data is the users
        
            dispatch(fetchPlantsSuccess(plantData))
          })
          .catch(error => {
            // error.message is the error message
            dispatch(fetchPlantsFailure(error.message))
          })
    }
};

/*
export const addPlantThunk = (plantData) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append('plantName', plantData.name);
        formData.append('wateringFrequency', plantData.wateringFrequency);
        formData.append('lastWatered', plantData.lastWatered);
        formData.append('id', plantData.id);

        if (plantData.imageFile) {
            formData.append('imageFile', plantData.imageFile);
        } else if (plantData.imageURL) {
            formData.append('imageURL', plantData.imageURL);
        }

        const response = await fetch('/plants/add', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            dispatch(addPlant(plantData));
        }
    } catch (error) {
        console.error('Error adding plant:', error);
    }
};
*/

/*
export const createTasksThunk = (plants) => (dispatch) => {
    const tasks = plants.map((plant) => {
        const lastWatered = moment(plant.lastWatered);
        let nextWateringDate = lastWatered.clone();

        if (plant.wateringFrequency === 'Every Day') {
            nextWateringDate.add(1, 'days');
        } else if (plant.wateringFrequency === 'every second day') {
            nextWateringDate.add(2, 'days');
        } else if (plant.wateringFrequency === 'weekly') {
            nextWateringDate.add(1, 'weeks');
        } else if (plant.wateringFrequency === 'monthly') {
            nextWateringDate.add(1, 'months');
        }

        const today = moment();
        let type: 'today' | 'late' | 'upcoming';

        if (nextWateringDate.isSame(today, 'day')) {
            type = 'today';
        } else if (nextWateringDate.isBefore(today, 'day')) {
            type = 'late';
        } else {
            type = 'upcoming';
        }

        return {
            date: nextWateringDate.format('YYYY-MM-DD'),
            taskName: `Water ${plant.name}`,
            type,
        };
    });

    dispatch(createTasks(tasks));
};
*/

// Store setup
const store = configureStore(
    {
    reducer: {
        plants: plantReducer,

}});


export default store;
