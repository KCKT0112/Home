export default {
    state: {
        data:[]
    },
    mutations: {
        pushstate(state, data){
            state.data = data;
        }
    }
};