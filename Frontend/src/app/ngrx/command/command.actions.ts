import { createAction, props } from '@ngrx/store';

export const navigate = createAction('[Layout Component] Navigate', props<{route:string}>());
export const context = createAction('[Any Component] Context', props<{context: string}>());
export const action = createAction('[Any Component] Action', props<{action: string, actionParam: string}>());

export const toConfigurations = createAction('[Record Component] ToConfigurations');
export const toProcessList = createAction('[Record Component] ToProcessList');
export const toCommandList = createAction('[Record Component] ToCommandList');