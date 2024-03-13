#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
#include <assert.h>
#include "TM.h"

#define MAXLINE 2048


int main() {
    printf("@@@@@@@@@@@@@@@@@\n\n Weclome to TM tester!!! \n\n@@@@@@@@@@@@@@@@@\n");

    TM *M = tmfromfile();
    run(M);
    
    free_TM(M);

    return 0;
}
