/**
 * Source original base/event/main.php check_event_happen_special().
 * Event body effects are implemented by other modules; return only gate.
 * Must not be mistaken for a complete original event_main port.
 */
export function originalBaseEventSpecial(
 art:string,place:number|string,inDuel:boolean
):boolean {
 const numeric=typeof place==="number"?place:
   /^\s*[+-]?\d+\s*$/.test(place)?Number(place):NaN;
 return art!=="Untainted Glory" && numeric===34 && !inDuel;
}