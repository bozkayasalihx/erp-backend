import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from "typeorm";
import { User } from "../models";
import { userOperation } from "../services";
import { UserTypes } from "../types/types";

@EventSubscriber()
export class UserCreateSubs implements EntitySubscriberInterface<any> {
    async beforeInsert(event: InsertEvent<any>) {
        if (!event.entity.created_at || !event.entity.updated_at) {
            let user: User | null = null;

            console.log("listening events...");
            try {
                user = await User.findOne({ where: { username: "bob" } });
            } catch (err) {
                console.log("err", err);
                const u = userOperation.creatUser({
                    username: "bob",
                    email: "bob@bob.com",
                    mobile: "29384923749",
                    password: "129381293712937123",
                    tckn: BigInt("2873192372"),
                    user_type: UserTypes.VENDOR_ADMIN,
                });

                user = await u.save();
            }

            event.entity.created_by = user;
            event.entity.updated_by = user;
        }
    }
}
