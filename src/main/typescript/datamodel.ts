import { v4 as uuidv4 } from 'uuid';

class ModelNode {
    private type: string;
    private uuid: string;

    constructor(type, uuid?:string) {
        this.type = type;
        this.uuid = uuid || uuidv4();
    }
}

export class Type extends ModelNode {
    private name: String;
    private fields: Field[];

    constructor(name:String, uuid?:string) {
        super("Type", uuid);
        this.name = name;
        this.fields = [];
    }
}

export class Field extends ModelNode {
    private name: String;

    constructor(name:String, uuid?:string) {
        super("Field", uuid);
        this.name = name;
    }
}