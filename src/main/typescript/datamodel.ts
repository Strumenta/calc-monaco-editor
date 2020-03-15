import { v4 as uuidv4 } from 'uuid';

class ModelNode {
    private type: string;
    private uuid: string;

    constructor(type, uuid?:string) {
        this.type = type;
        this.uuid = uuid || uuidv4();
    }
}

export class Type extends ModelNode{
    constructor(uuid?:string) {
        super("Type", uuid);
    }
}