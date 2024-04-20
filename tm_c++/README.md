# Project 1 (Sub proejct); Turing Machine in C++ (migrated code)
## Version 0 (final)

Standard usage of characters to denote states (Q), alphabet (Sigma), and Tape alphabet (Gamma). In which sense use of string manipluation in C similar to python, slower runtimes but easier to look at
Uses file I/O to implement free creation of a TM interperter for some arbitrary Turing Machine.
Fill out a .txt file in this style:
" state tape_symbol : new_state new_tape_symbol direction
  state tape_symbol : new_state new_tape_symbol direction..."
  where state/new_state is "q0, q1, q2...", tape_symbol is defined by your Gamma and direction is defined
  by "L,R" so given gamma = {0,1, _} then "q0 0 : q3 _ R" would be correct syntax for filling out the file to compelete the state diagram
  Keep file in same directory as program files so putting in filename at program request will suffice without need for absolute path of file
  Turing Machine will be validated before running and user can run indefinite number of tests as they see fit through the command line
  
