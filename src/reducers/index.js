import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import aip from "./aipReducer";
import app from "./appReducer";
import batch from "./batchReducer";
import deletionRequest from "./deletionRequestReducer";
import incident from "./incidentReducer";
import job from "./jobReducer";
import query from "./queryReducer";
import producer from "./producerReducer";
import producerProfile from "./producerProfileReducer";
import routine from "./routineReducer";
import sipProfile from "./sipProfileReducer";
import storage from "./storageReducer";
import users from "./usersReducer";
import validationProfile from "./validationProfileReducer";
import workflow from "./workflowReducer";
import workflowDefinition from "./workflowDefinitionReducer";

export default combineReducers({
  form,
  aip,
  app,
  batch,
  deletionRequest,
  incident,
  job,
  query,
  producer,
  producerProfile,
  routine,
  sipProfile,
  storage,
  users,
  validationProfile,
  workflow,
  workflowDefinition
});
