import { createReducer, on } from '@ngrx/store';
import { navigate, context, action } from './command.actions';

// contextReducer constants
export const PROCESS_LIST_CONTEXT = 'ProcessListComponent';

// navReducer constants
export const HOME = 'inicio';
export const CONFIGURATIONS = 'configuracion';
export const PROCESS_LIST = 'procesos';
export const COMMMAND_LIST = 'comandos';

// actionRedcuer constants
export const ACTION_EXPAND = 'expand';
export const ACTION_CHANGE_STATUS_VIEW = 'changeStatusView';

export const initialState = '';

const _contextReducer = createReducer(initialState,
    on(context, (state, param) => {
        console.log("%c Contexto: "+param.context, 'background: black; color: #bada55');        
        return param.context;
    })    
);

const _navReducer = createReducer(initialState,
  on(navigate, (state, param) => {
      console.log("navigate reducer: "+param.route);
      
      switch(param.route) {
          case HOME: return '/bash/menu';
          case CONFIGURATIONS: return '/bash/configuracion';
          case PROCESS_LIST: return '/bash/procesos';
          case COMMMAND_LIST: return '/bash/comandos';
      }
  })
);

const _actionReducer = createReducer(initialState,
    on(action, (state, param) => {
        console.log("action reducer: "+param.action);
        
        switch(param.action) {
            case ACTION_CHANGE_STATUS_VIEW:
                return param.actionParam;

            case ACTION_EXPAND:
                return param.actionParam;                
        }
    })    
);


export function contextReducer(state, action) {
    return _contextReducer(state, action);
}

export function navReducer(state, action) {
    return _navReducer(state, action);
}

export function actionReducer(state, action) {
    return _actionReducer(state, action);
}