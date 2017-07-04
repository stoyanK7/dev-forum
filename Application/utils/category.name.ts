export function catName(category: string) {
    let cat: string;
    switch (category.toLowerCase()) {
        case "dotnet":
            cat = ".NET Programming(C#/VB.NET/.NET Framework)";
            break;
        case "linux":
            cat = "Linux(Programming and working on Linux)";
            break;
        case "other":
            cat = "Other..";
            break;
        case "computersecurity":
            cat = "Computer Security (viruses,spam, spyware, adware)";
            break;
        case "jobads":
            cat = "Job Ads";
            break;
        case "ban":
            cat = "Books/ Articles/ News";
            break;
        case "ccpp":
            cat = "C/C++";
            break;
        case "java":
            cat = "Java";
            break;
        case "clientside":
            cat = "HTML/ CSS/ JS(Client-side Programming)";
            break;
        case "serverside":
            cat = "PHP/Python/ NodeJS/Ruby (Server-side programming)";
            break;
    }
    return cat;
}
