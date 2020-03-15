class ModelNode {
    private type: string;

    constructor(type) {
        this.type = type;
    }
}

export class Type extends ModelNode{
    constructor() {
        super("Type");
    }
}