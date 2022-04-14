import { ViewColumn, ViewEntity } from "typeorm";


//FIXME: daha bitmedi uzerinde calisiliyor 
@ViewEntity({
    expression: `
        SELECT user_id, ref_entity_id, user_tbl.* 
        FROM user_entity_relation 
        INNER JOIN user_tbl on user_id = user_tbl.id
        
    `,
})
export default class MiddleViewLayer {
    @ViewColumn()
    ref_entity_id: number;
}
