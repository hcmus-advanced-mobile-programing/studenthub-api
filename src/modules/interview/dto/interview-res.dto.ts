import { ICommonAttr } from "src/common/common.dto";
import { DisableFlag } from "src/common/common.enum";

export interface InterviewResDto extends ICommonAttr {
    title: string;
    startTime: Date;
    endTime: Date;
    disableFlag: DisableFlag;
}