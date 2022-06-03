export interface IdChecks {
    index: number,
    entities: any[]
}
export class MkController {
    public static async checkIdExits(ids: number[], repo: any): Promise<IdChecks> {
        let index = 0
        let entities = []
        //res中index初始值为-1
        let res: IdChecks = {index: -1, entities}

        for (index = 0; index < ids.length; index++) {
            try {
                let entity = await repo.findOneOrFail(ids[index])
                res.entities.push(entity)
            } catch (error) {
                //有一个id不符合就应该中止
                break
            }
        }
        if (index === ids.length) {
            res.index = -1
        } else {
            //保存出错的id
            res.index = ids[index]
        }
        return res
    }
}