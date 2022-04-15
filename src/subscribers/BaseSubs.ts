import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";

@EventSubscriber()
export default class EveryThingSubscriber implements EntitySubscriberInterface {
  async afterLoad(event: InsertEvent<any>) {
    // const maker = await appDataSource.manager.query(
    //     `select * from middle_view_layer`
    // );
    console.log("after insert runnes");

    // test this feature;
  }
}
