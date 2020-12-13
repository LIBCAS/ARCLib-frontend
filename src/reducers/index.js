import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import aip from './aipReducer';
import app from './appReducer';
import batch from './batchReducer';
import deletionRequest from './deletionRequestReducer';
import format from './formatReducer';
import incident from './incidentReducer';
import issueDictionary from './issueDictionaryReducer';
import job from './jobReducer';
import notification from './notificationReducer';
import producer from './producerReducer';
import producerProfile from './producerProfileReducer';
import query from './queryReducer';
import risk from './riskReducer';
import roles from './rolesReducer';
import report from './reportReducer';
import routine from './routineReducer';
import sipProfile from './sipProfileReducer';
import storage from './storageReducer';
import tool from './toolReducer';
import users from './usersReducer';
import validationProfile from './validationProfileReducer';
import workflow from './workflowReducer';
import workflowDefinition from './workflowDefinitionReducer';

export default combineReducers({
  form,
  aip,
  app,
  batch,
  deletionRequest,
  format,
  incident,
  issueDictionary,
  job,
  notification,
  producer,
  producerProfile,
  query,
  report,
  risk,
  routine,
  sipProfile,
  storage,
  tool,
  users,
  roles,
  validationProfile,
  workflow,
  workflowDefinition,
});
