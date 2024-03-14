#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "TM.h"



int main() {
    printf("@@@@@@@@@@@@@@@@@\n\n Weclome to TM tester!!! \n\n@@@@@@@@@@@@@@@@@\n");

    TM *M = tmfromfile();
    run(M);

    free_TM(M);

    return 0;
}
