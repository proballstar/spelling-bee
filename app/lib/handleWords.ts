interface APIEntity {
    value: string;
    exist: boolean;
}

export interface APIInterface {
    definition: {
        value: string;
        exist: boolean;
    };
    etymology: {
        value: string;
        exist: boolean;
    };
}

export function handleAPIResult(data: any): APIInterface {
    const wordInfo = data[0]
    return {
        definition: handleDefinition(wordInfo),
        etymology: handleEtymology(wordInfo)
    }
}

function handleDefinition(wordInfo: any): APIEntity {
    if(!wordInfo) {
        return {
            value: 'Loading...',
            exist: false
        }
    }
    if(!wordInfo["shortdef"]) {
        return {
            value: "No definition available at the moment",
            exist: false
        }
    }
    return {
        value: wordInfo["shortdef"].join(". Another definition is: "),
        exist: true
    }
}

function handleEtymology(wordInfo: any): APIEntity {
    if(!wordInfo) {
        return {
            value: 'Loading...',
            exist: false
        }
    }
    if(!wordInfo["et"]) {
        return {
            value: "No etymology available at the moment",
            exist: false
        }
    }
    const ets = wordInfo["et"]
    let sen = ""
    ets.forEach((et: any) => {
        if (ets[1] == undefined || ets[1] == null) {
            return {
                value: "No etymology available at the moment",
                exist: false
            }
        }
        sen = sen + ets[1] + "in addition,"
    })
    if(sen == "") {
        return {
            value: "No etymology available at the moment",
            exist: false
        }
    }
    return {
        value: sen,
        exist: true
    }
}