import dispatcher from "./dispatcher";

export function get(data) {
    dispatcher.dispatch({
        type: "GET",
        data: data
    });
}
export function add(data) {
    dispatcher.dispatch({
        type: "ADD",
        data: data
    });
}
export function update(data) {
    dispatcher.dispatch({
        type: "UPDATE",
        data: data
    });
}
export function destroy(data) {
    dispatcher.dispatch({
        type: "DESTROY",
        data: data
    });
}
