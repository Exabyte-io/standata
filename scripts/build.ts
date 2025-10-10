
import { ApplicationsProcessor } from "./processors/ApplicationsProcessor";
import { MethodsProcessor } from "./processors/MethodsProcessor";
import { ModelsProcessor } from "./processors/ModelsProcessor";
import { SubworkflowsProcessor } from "./processors/SubworkflowsProcessor";
import { WorkflowsProcessor } from "./processors/WorkflowsProcessor";

class BuildManager {
    private processors = [
        new ModelsProcessor(),
        new MethodsProcessor(),
        new ApplicationsProcessor(),
        new WorkflowsProcessor(),
        new SubworkflowsProcessor(),
    ];

    public async run() {
        for (const processor of this.processors) {
            await processor.process();
        }
    }
}

new BuildManager().run();
